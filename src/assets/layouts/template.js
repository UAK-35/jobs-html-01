// Template wrapper

module.exports = (data) => {
  console.error('data11', data);
  return (
    require('./template.ejs')(
      {
        ...data,
        cnt: require(`../../views/${data.page}.ejs`)(data),
      }
    )
  );
};
