const SseService = require('../services/sseService');

class SseController {
  static subscribe(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*'
    });

    const clientId = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    SseService.addClient(clientId, res);

    req.on('close', () => {
      SseService.removeClient(clientId);
    });
  }
}

module.exports = SseController;
