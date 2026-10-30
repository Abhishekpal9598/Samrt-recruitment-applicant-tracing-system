import { errorResponse } from '../utils/response.js';

export function notFoundHandler(req, res) {
  return errorResponse(
    res,
    'RESOURCE_NOT_FOUND',
    `The requested resource endpoint '${req.method} ${req.originalUrl}' does not exist on this server.`,
    404
  );
}

export default notFoundHandler;
