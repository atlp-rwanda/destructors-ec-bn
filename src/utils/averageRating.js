export const calculateAverageRating = (reviews) => {
    const totalRatings = reviews.reduce((acc, cur) => acc + cur.rating, 0);
    const averageRating = totalRatings / reviews.length;
    return averageRating;
  };
  