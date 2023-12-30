import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";

dayjs.extend(calendar);

function orderAndModifyThumbnailList(thumbnails, userData) {
  const thumbnail_order = ["new", "ref", "sub", "sdss", "ls", "ps1"];
  const sortThumbnailsByDate = (a, b) => {
    const aDate = dayjs(a.created_at);
    const bDate = dayjs(b.created_at);
    if (aDate.isAfter(bDate)) {
      return -1;
    }
    if (aDate.isBefore(bDate)) {
      return 1;
    }
    return 0;
  };
  thumbnails
    ?.filter((thumbnail) => thumbnail_order.includes(thumbnail.type))
    ?.sort(sortThumbnailsByDate);

  const latestThumbnails = thumbnail_order
    ?.map((type) => thumbnails.find((thumbnail) => thumbnail.type === type))
    ?.filter((thumbnail) => thumbnail !== undefined);

  latestThumbnails?.sort((a, b) =>
    thumbnail_order.indexOf(a.type) < thumbnail_order.indexOf(b.type) ? -1 : 1
  );

  const modifiedThumbnails = latestThumbnails.map((originalThumbnail) => {
    if (originalThumbnail.public_url.startsWith("/static")) {
      originalThumbnail.public_url = `${userData.url}/${originalThumbnail.public_url}`;
    }
    return originalThumbnail;
  });

  return modifiedThumbnails;
}

export default orderAndModifyThumbnailList;
