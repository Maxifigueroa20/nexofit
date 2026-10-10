let clients = [];

class SseService {
  static addClient(id, res) {
    clients.push({ id, res });
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', clientId: id })}\n\n`);
  }

  static removeClient(id) {
    clients = clients.filter((c) => c.id !== id);
  }

  static getClientCount() {
    return clients.length;
  }

  static broadcast(eventType, payload) {
    const message = `data: ${JSON.stringify({
      type: eventType,
      payload,
      timestamp: new Date().toISOString()
    })}\n\n`;

    clients.forEach((client) => {
      try {
        client.res.write(message);
      } catch (err) {}
    });
  }
}

module.exports = SseService;
