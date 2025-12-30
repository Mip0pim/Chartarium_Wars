/**
 * Servicio de gestión de mensajes usando closures
 *
 * Requisitos:
 * - Usar closures para mantener estado privado
 * - Mantener un array de mensajes en memoria
 * - Cada mensaje debe tener: {id, email, message, timestamp}
 * - Verificar que el email existe usando userService.getUserByEmail()
 */

export function createMessageService(userService) {
  // Estado privado
  let messages = [];
  let nextId = 1;

  /**
   * Crea un nuevo mensaje
   * @param {string} email - Email del usuario que envía
   * @param {string} message - Contenido del mensaje
   * @returns {Object} Mensaje creado
   * @throws {Error} Si el email no existe
   */
  function createMessage(email, message) {
    const user = userService.getUserByEmail(email);

    if (!user) {
      throw new Error(`No existe un usuario con el email: ${email}`);
    }

    const newMessage = {
      id: nextId++,
      email,
      message,
      timestamp: new Date().toISOString()
    };

    messages.push(newMessage);
    return newMessage;
  }

  /**
   * Obtiene los últimos N mensajes
   * @param {number} limit - Cantidad de mensajes a retornar
   * @returns {Array} Array de mensajes
   */
  function getRecentMessages(limit = 50) {
  return messages
    .slice()
    .sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    })
    .slice(0, limit);
}


  /**
   * Obtiene mensajes desde un timestamp específico
   * @param {string} since - Timestamp ISO
   * @returns {Array} Mensajes nuevos desde ese timestamp
   */
  function getMessagesSince(since) {
    const sinceDate = new Date(since);
    return messages.filter(msg => new Date(msg.timestamp) > sinceDate);
  }

  // API pública
  return {
    createMessage,
    getRecentMessages,
    getMessagesSince
  };
}
