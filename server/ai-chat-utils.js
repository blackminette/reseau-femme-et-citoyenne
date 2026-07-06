'use strict';

function safeJson(value, fallback) {
  if (value == null) return fallback;
  if (Array.isArray(value) || typeof value === 'object') return value;
  if (typeof value !== 'string') return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function publicChild(row) {
  if (!row) {
    return {
      prenom: '',
      age: null,
      badges: [],
      scores: [],
    };
  }

  const scores = safeJson(row.scores, []);
  const badges = safeJson(row.badges, []);

  return {
    ...row,
    scores: Array.isArray(scores) ? scores : [],
    badges: Array.isArray(badges) ? badges : [],
  };
}

function contentItem(row) {
  if (!row) return null;

  return {
    ...row,
    id: row.id,
    title: row.title ?? row.titre ?? row.name ?? row.label ?? '',
    type: row.type ?? row.kind ?? '',
    text: row.text ?? row.texte ?? row.description ?? '',
    questions: Array.isArray(row.questions)
      ? row.questions
      : safeJson(row.questions, []),
  };
}

function sameId(left, right) {
  if (left == null || right == null) return false;
  return String(left) === String(right);
}

module.exports = {
  safeJson,
  publicChild,
  contentItem,
  sameId,
};
