"use client";
import { useEffect, useEffectEvent, useRef, useState, type CSSProperties } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { companyVideoSource, videoTime } from "../lib/company-video";
import { loadYouTube, type YouTubePlayer } from "../lib/youtube-player";
import v from "./company-video.module.scss";

type Controls = {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  mute: (value: boolean) => void;
};
const initial = { ready: false, playing: false, muted: true, time: 0, duration: 0, error: false };

/** One playback adapter serves both the silent reel and the cinematic player. */
export function CompanyVideo({
  url,
  preview = false,
  active = true,
}: {
  url: string;
  preview?: boolean;
  active?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef<Controls | null>(null);
  const [state, setState] = useState(initial);
  const shouldPlay = useEffectEvent(() => active && !document.hidden);

  useEffect(() => {
    const source = companyVideoSource(url);
    if (!source || !host.current) return;
    const container = host.current;
    let disposed = false;
    let player: YouTubePlayer | undefined;
    let video: HTMLVideoElement | undefined;
    let poll: ReturnType<typeof setInterval> | undefined;
    const error = () => {
      if (!disposed) setState((s) => ({ ...s, error: true, playing: false }));
    };
    const ready = () => {
      clearTimeout(readyTimeout);
      if (!disposed) setState((s) => ({ ...s, ready: true, error: false }));
    };
    const readyTimeout = setTimeout(error, 20000);
    if (source.kind === "file") {
      video = document.createElement("video");
      video.src = source.url;
      video.muted = preview;
      video.loop = preview;
      video.playsInline = true;
      video.preload = "metadata";
      video.setAttribute("aria-label", "Company profile Seni Religi");
      container.append(video);
      const media = video;
      controls.current = {
        play: () => {
          void media.play().catch(() => {
            if (!disposed) setState((s) => ({ ...s, playing: false }));
          });
        },
        pause: () => media.pause(),
        seek: (time) => {
          media.currentTime = time;
        },
        mute: (muted) => {
          media.muted = muted;
        },
      };
      const sync = () => {
        if (!disposed)
          setState((s) => ({
            ...s,
            playing: !media.paused,
            muted: media.muted,
            time: media.currentTime,
            duration: Number.isFinite(media.duration) ? media.duration : 0,
          }));
      };
      media.onloadedmetadata = () => {
        ready();
        sync();
        if (shouldPlay()) controls.current?.play();
      };
      media.ontimeupdate =
        media.onplay =
        media.onpause =
        media.onvolumechange =
        media.onended =
          sync;
      // Native video clicks toggle playback; the dialog closes only via its close button or Escape.
      if (!preview)
        media.onclick = () => {
          if (media.paused) controls.current?.play();
          else media.pause();
        };
      media.onplaying = ready;
      media.onerror = error;
    } else {
      void loadYouTube()
        .then((YT) => {
          if (disposed) return;
          const slot = document.createElement("div");
          container.append(slot);
          player = new YT.Player(slot, {
            videoId: source.id,
            host: "https://www.youtube-nocookie.com",
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: 0,
              controls: 0,
              playsinline: 1,
              rel: 0,
              fs: 0,
              origin: location.origin,
              ...(preview ? { mute: 1, loop: 1, playlist: source.id } : {}),
            },
            events: {
              onReady: ({ target }) => {
                if (disposed) return;
                ready();
                if (preview) target.mute();
                target.getIframe().title = "Company profile Seni Religi";
                if (preview) target.getIframe().tabIndex = -1;
                controls.current = {
                  play: () => target.playVideo(),
                  pause: () => target.pauseVideo(),
                  seek: (time) => target.seekTo(time, true),
                  mute: (muted) => (muted ? target.mute() : target.unMute()),
                };
                if (shouldPlay()) target.playVideo();
                poll = setInterval(() => {
                  if (!disposed)
                    setState((s) => ({
                      ...s,
                      time: target.getCurrentTime() || 0,
                      duration: target.getDuration() || 0,
                      muted: target.isMuted(),
                      playing: target.getPlayerState() === 1,
                    }));
                }, 500);
              },
              onStateChange: ({ data, target }) => {
                if (disposed) return;
                if (data === 1) ready();
                setState((s) => ({ ...s, playing: data === 1 }));
                if (data === 0 && preview && shouldPlay()) {
                  target.seekTo(0, true);
                  target.playVideo();
                }
              },
              onError: error,
              onAutoplayBlocked: () => {
                if (!disposed) setState((s) => ({ ...s, playing: false }));
              },
            },
          });
        })
        .catch(error);
    }
    const visibility = () => {
      if (document.hidden) controls.current?.pause();
      else if (preview && shouldPlay()) controls.current?.play();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true;
      clearInterval(poll);
      clearTimeout(readyTimeout);
      document.removeEventListener("visibilitychange", visibility);
      controls.current = null;
      player?.destroy();
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
      container.replaceChildren();
    };
  }, [url, preview]);

  useEffect(() => {
    if (active) controls.current?.play();
    else controls.current?.pause();
  }, [active]);
  const toggle = () => {
    if (state.playing) controls.current?.pause();
    else controls.current?.play();
  };
  return (
    <div
      className={preview ? v.preview : v.player}
      data-playing={state.playing}
      data-error={state.error}
    >
      <div ref={host} className={v.media} />
      {!preview && (
        <>
          {!state.ready && !state.error && (
            <p className={v.status} role="status">
              Memuat video…
            </p>
          )}
          {state.error && (
            <p className={v.status} role="alert">
              Video belum dapat diputar.{" "}
              <a href={url} target="_blank" rel="noreferrer">
                Buka video asli ↗
              </a>
            </p>
          )}
          {state.ready && !state.playing && !state.error && (
            <button className={v.resume} onClick={toggle} aria-label="Putar video">
              <Play fill="currentColor" />
            </button>
          )}
          <div className={v.controls} data-video-controls>
            <button
              onClick={toggle}
              disabled={!state.ready || state.error}
              aria-label={state.playing ? "Jeda video" : "Putar video"}
            >
              {state.playing ? <Pause size={15} /> : <Play size={15} />}
              <span>{state.playing ? "JEDA" : "PUTAR"}</span>
            </button>
            <input
              style={
                {
                  "--progress": `${state.duration ? (state.time / state.duration) * 100 : 0}%`,
                } as CSSProperties
              }
              aria-label="Posisi video"
              type="range"
              min={0}
              max={state.duration || 1}
              step={0.1}
              value={Math.min(state.time, state.duration || 1)}
              disabled={!state.duration || state.error}
              onChange={(e) => {
                const time = Number(e.target.value);
                controls.current?.seek(time);
                setState((s) => ({ ...s, time }));
              }}
            />
            <span className={v.time}>
              {videoTime(state.time)} / {videoTime(state.duration)}
            </span>
            <button
              onClick={() => {
                controls.current?.mute(!state.muted);
                setState((s) => ({ ...s, muted: !s.muted }));
              }}
              disabled={!state.ready || state.error}
              aria-label={state.muted ? "Aktifkan suara" : "Matikan suara"}
            >
              {state.muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              <span>{state.muted ? "SUARA" : "BISUKAN"}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
