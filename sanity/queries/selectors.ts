export const HOME_PAGE_SELECTOR = '*[_type == "homePage" && _id == "homePage"][0]';
export const VISI_MISI_SELECTOR = '*[_type == "visiMisi" && _id == "visiMisi"][0]';
export const BIDANG_CARDS_QUERY = `*[_type == "bidang" && defined(slug.current)] | order(_createdAt asc) {
  _id, "slug": slug.current, abbr, fullName, "imageUrl": image.asset->url
}`;
