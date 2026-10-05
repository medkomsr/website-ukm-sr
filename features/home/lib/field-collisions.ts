import { Bodies, Body, Collision, Composite, Constraint, Engine } from "matter-js";

export type FieldPose = {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
};
/** A zero-gravity playground: real rotated collisions, elastic grabs and release momentum. */
export function createFieldWorld(
  homes: FieldPose[],
  width: number,
  height: number,
  reduced = false,
) {
  const engine = Engine.create({
    positionIterations: 24,
    velocityIterations: 10,
    constraintIterations: 2,
    gravity: { x: 0, y: 0, scale: 0 },
  });
  const bodies = homes.map((home) => {
    const body = Bodies.rectangle(home.x, home.y, home.width + 12, home.height + 18, {
      angle: home.angle,
      chamfer: { radius: 8 },
      restitution: reduced ? 0 : 0.38,
      friction: 0.015,
      frictionStatic: 0.02,
      frictionAir: reduced ? 0.2 : 0.045,
      slop: 0.02,
    });
    Body.setMass(body, 1);
    return body;
  });
  const walls = [
    Bodies.rectangle(width / 2, -100, width + 400, 200, { isStatic: true }),
    Bodies.rectangle(width / 2, height + 100, width + 400, 200, {
      isStatic: true,
    }),
    Bodies.rectangle(-100, height / 2, 200, height + 400, { isStatic: true }),
    Bodies.rectangle(width + 100, height / 2, 200, height + 400, {
      isStatic: true,
    }),
  ];
  Composite.add(engine.world, [...bodies, ...walls]);
  let grab: Constraint | null = null,
    active = -1;
  let target = { x: 0, y: 0 };
  const release = () => {
    if (grab) Composite.remove(engine.world, grab);
    if (reduced && active >= 0) {
      Body.setVelocity(bodies[active], { x: 0, y: 0 });
      Body.setAngularVelocity(bodies[active], 0);
    }
    grab = null;
    active = -1;
  };
  return {
    bodies,
    grab(index: number, point: { x: number; y: number }) {
      release();
      active = index;
      target = { ...point };
      const body = bodies[index];
      grab = Constraint.create({
        pointA: { ...point },
        bodyB: body,
        pointB: { x: point.x - body.position.x, y: point.y - body.position.y },
        length: 0,
        stiffness: reduced ? 0.2 : 0.045,
        damping: 0.08,
      });
      Composite.add(engine.world, grab);
    },
    move(point: { x: number; y: number }) {
      target = {
        x: Math.max(0, Math.min(width, point.x)),
        y: Math.max(0, Math.min(height, point.y)),
      };
    },
    release,
    nudge(index: number, x: number, y: number) {
      Body.setVelocity(bodies[index], { x: x * 0.18, y: y * 0.18 });
    },
    step(delta: number) {
      const frames = Math.max(1, Math.ceil(Math.min(delta, 32) / (1000 / 120)));
      const dt = Math.min(delta, 32) / frames;
      for (let frame = 0; frame < frames; frame++) {
        const previous = bodies.map((body) => ({
          x: body.position.x,
          y: body.position.y,
          angle: body.angle,
        }));
        if (grab) {
          const body = bodies[active];
          const halfW = (body.bounds.max.x - body.bounds.min.x) / 2;
          const halfH = (body.bounds.max.y - body.bounds.min.y) / 2;
          const safeX = Math.max(
            halfW + grab.pointB.x,
            Math.min(width - halfW + grab.pointB.x, target.x),
          );
          const safeY = Math.max(
            halfH + grab.pointB.y,
            Math.min(height - halfH + grab.pointB.y, target.y),
          );
          const dx = safeX - grab.pointA.x,
            dy = safeY - grab.pointA.y;
          const length = Math.hypot(dx, dy),
            blend = length > 5 ? 5 / length : 1;
          grab.pointA.x += dx * blend;
          grab.pointA.y += dy * blend;
        }
        bodies.forEach((body, i) => {
          if (body.speed > 24)
            Body.setVelocity(body, {
              x: (body.velocity.x * 24) / body.speed,
              y: (body.velocity.y * 24) / body.speed,
            });
          if (i !== active)
            Body.setAngularVelocity(
              body,
              body.angularVelocity * 0.97 + (homes[i].angle - body.angle) * 0.003,
            );
          if (Math.abs(body.angle) > 0.5) {
            const direction = Math.sign(body.angle);
            Body.setAngle(body, direction * 0.5);
            if (body.angularVelocity * direction > 0)
              Body.setAngularVelocity(body, body.angularVelocity * -0.2);
          }
        });
        Engine.update(engine, dt);
        const contain = (body: Body) => {
          const xs = body.vertices.map((v) => v.x),
            ys = body.vertices.map((v) => v.y);
          const dx =
            Math.min(...xs) < 0
              ? -Math.min(...xs)
              : Math.max(...xs) > width
                ? width - Math.max(...xs)
                : 0;
          const dy =
            Math.min(...ys) < 0
              ? -Math.min(...ys)
              : Math.max(...ys) > height
                ? height - Math.max(...ys)
                : 0;
          if (dx || dy) Body.translate(body, { x: dx, y: dy });
        };
        // Resolve the actual rotated shapes, including spring pressure against a wall.
        for (let pass = 0; pass < 24; pass++) {
          bodies.forEach(contain);
          let overlap = 0;
          for (let i = 0; i < bodies.length; i++)
            for (let j = i + 1; j < bodies.length; j++) {
              const a = bodies[i],
                b = bodies[j],
                collision = Collision.collides(a, b);
              if (!collision || collision.depth < 0.05) continue;
              overlap = Math.max(overlap, collision.depth);
              const n = collision.normal,
                sign =
                  n.x * (a.position.x - b.position.x) + n.y * (a.position.y - b.position.y) > 0
                    ? 1
                    : -1;
              const wa = i === active ? 0.25 : 1,
                wb = j === active ? 0.25 : 1;
              const distance = collision.depth + 0.1;
              Body.translate(a, {
                x: (n.x * sign * distance * wa) / (wa + wb),
                y: (n.y * sign * distance * wa) / (wa + wb),
              });
              Body.translate(b, {
                x: (-n.x * sign * distance * wb) / (wa + wb),
                y: (-n.y * sign * distance * wb) / (wa + wb),
              });
            }
          if (overlap < 0.05) break;
        }
        bodies.forEach(contain);
        if (
          bodies.some((body, i) =>
            bodies
              .slice(i + 1)
              .some((other) => (Collision.collides(body, other)?.depth ?? 0) > 0.5),
          )
        ) {
          bodies.forEach((body, i) => {
            Body.setPosition(body, previous[i]);
            Body.setAngle(body, previous[i].angle);
            Body.setVelocity(body, { x: 0, y: 0 });
            Body.setAngularVelocity(body, 0);
          });
        }
      }
    },
    setPose(index: number, x: number, y: number, angle: number) {
      Body.setPosition(bodies[index], { x, y });
      Body.setAngle(bodies[index], angle);
      Body.setVelocity(bodies[index], { x: 0, y: 0 });
      Body.setAngularVelocity(bodies[index], 0);
    },
    dispose() {
      release();
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    },
  };
}
