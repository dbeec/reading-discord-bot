const queues = {}; // { "guildId-channelId": [user1, user2, ...] }

function getKey(guildId, channelId) {
  return `${guildId}-${channelId}`;
}

function addToQueue(guildId, channelId, user) {
  const key = getKey(guildId, channelId);
  if (!queues[key]) queues[key] = [];

  if (!queues[key].some(u => u.id === user.id)) {
    queues[key].push({ id: user.id, tag: user.tag });
    return true;
  }
  return false;
}

function removeFromQueue(guildId, channelId, userId) {
  const key = getKey(guildId, channelId);
  if (queues[key]) {
    queues[key] = queues[key].filter(u => u.id !== userId);
    if (queues[key].length === 0) delete queues[key];
  }
}

function isInQueue(guildId, channelId, userId) {
  const key = getKey(guildId, channelId);
  return queues[key]?.some(u => u.id === userId);
}

function getQueue(guildId, channelId) {
  const key = getKey(guildId, channelId);
  return queues[key] || [];
}

module.exports = {
  addToQueue,
  removeFromQueue,
  isInQueue,
  getQueue,
};