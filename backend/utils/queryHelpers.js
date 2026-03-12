const applyArrayFilter = (query, field, value, matchType) => {
    if (!value) return;
    const vals = value.split(',').map(v => v.trim().toLowerCase());
    query[field] = (matchType === 'all') ? { $all: vals } : { $in: vals };
}

// utils/queryHelpers.js
const parseJsonFields = (data, fields) => {
    fields.forEach(field => {
        // Only process if it's a string. If it's already an array, leave it!
        if (data[field] && typeof data[field] === 'string') {
            try {
                const parsed = JSON.parse(data[field]);
                // Force it to be a real JS array
                data[field] = Array.isArray(parsed) ? parsed : [parsed];
            } catch (error) {
                // If it's just a plain string "Hello", wrap it: ["Hello"]
                data[field] = [data[field]];
            }
        }
    });
};

const SPIRIT_GROUPS = {
    whiskey: ['whiskey', 'bourbon', 'rye', 'scotch'],
};

module.exports = { applyArrayFilter, parseJsonFields, SPIRIT_GROUPS };