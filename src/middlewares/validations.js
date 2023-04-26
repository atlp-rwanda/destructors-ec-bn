function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(404).send({
        status: 400,
        error: error.details.map((detail) =>
          detail.message.replace(/[^a-zA-Z0-9 ]/g, ' ')
        ),
      });
    } else {
      next();
    }
  };
}
export default validate;
