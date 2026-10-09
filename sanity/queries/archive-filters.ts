export const activityFilter = `_type == "beritaAcara" && defined(slug.current) &&
  select(jenis == "acara" => "event", "article") in $types &&
  ($category == "all" || category == $category) &&
  ($status == "all" || (jenis == "acara" && status == $status)) &&
  ($search == "" || count(string::split(lower(coalesce(title, "") + " " + coalesce(description, "") + " " + coalesce(category, "")), $search)) > 1)`;

export const achievementFilter = `_type == "prestasi" &&
  ($year == "all" || string(year) == $year) &&
  ($field == "all" || field == $field) &&
  ($category == "all" || category == $category) &&
  ($search == "" || count(string::split(lower(coalesce(title, "") + " " + coalesce(description, "") + " " + coalesce(array::join(participants[].name, " "), "")), $search)) > 1)`;
