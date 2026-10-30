/**
 * Express middleware for declarative request schema validation using Zod
 * Supports validating req.body, req.query, and req.params
 */
export function validateRequest({ body, query, params }) {
  return (req, res, next) => {
    try {
      if (body) {
        req.body = body.parse(req.body);
      }
      if (query) {
        req.query = query.parse(req.query);
      }
      if (params) {
        req.params = params.parse(req.params);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default validateRequest;
