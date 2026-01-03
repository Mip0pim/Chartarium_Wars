/**
 * Servicio de gestión de usuarios usando closures
 * Este servicio mantiene el estado de los usuarios en memoria
 * y proporciona métodos para realizar operaciones CRUD
 */

export function createUserService() {
  // Estado privado: almacén de usuarios
  let users = [];
  let nextId = 1;
  /**
   * Crea un nuevo usuario
   * @param {Object} userData - { name, avatar, wins }
   * @returns {Object} Usuario creado
   */
  function createUser(userData) {
    // 1. Validar que el nombre no exista ya
    const existingUser = users.find(u => u.name === userData.name);
    if (existingUser) {
      console.log("Error: El nombre de usuario ya existe:", userData.name);
      throw new Error('Ocurrio un error al crear el usuario, nombre ya existe');
    }

    // 2. Crear objeto usuario con id único y createdAt
    const newUser = {
      id: String(nextId),
      name: userData.name,
      avatar: userData.avatar,
      wins: userData.wins || 0,
      createdAt: new Date().toISOString()
    };

    // 3. Agregar a la lista de usuarios
    users.push(newUser);

    // 4. Incrementar nextId
    nextId++;

    // 5. Retornar el usuario creado
    return newUser;
  }

  /**
   * Obtiene todos los usuarios
   * @returns {Array} Array de usuarios
   */
  function getAllUsers() {
    // Retornar una copia del array para evitar mutaciones externas
    return [...users];
  }

  /**
   * Busca un usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Object|null} Usuario encontrado o null
   */
  function getUserById(id) {
    const user = users.find(u => u.id === id);
    return user || null;
  }

  /**
   * Busca un usuario por nombre
   * @param {string} name - Nombre del usuario
   * @returns {Object|null} Usuario encontrado o null
   */
  function getUserByName(name) {
    console.log("Buscando usuario:", name); 
    console.log("Usuarios existentes:", users);
    const users2= getAllUsers();
    const user = users2.find(u => u.name === name);
    return user || null;
  }

  /**
   * Actualiza un usuario
   * @param {string} id - ID del usuario
   * @param {Object} updates - Campos a actualizar
   * @returns {Object|null} Usuario actualizado o null si no existe
   */
  function updateUser(id, updates) {
    const user = users.find(u => u.id === id);
    if (!user) return null;

    // Campos permitidos
    const allowedFields = ['avatar', 'wins'];

    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key)) {
        user[key] = updates[key];
      }
    }

    return user;
  }

  /**
   * Elimina un usuario
   * @param {string} id - ID del usuario
   * @returns {boolean} true si se eliminó, false si no existía
   */
  function deleteUser(id) {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;

    users.splice(index, 1);
    return true;
  }

  // Exponer la API pública del servicio
  return {
    createUser,
    getAllUsers,
    getUserById,
    getUserByName,
    updateUser,
    deleteUser
  };
}

