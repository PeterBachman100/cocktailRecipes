const applyArrayFilter = (query, field, value, matchType) => {
    if (!value) return;
    const vals = value.split(',').map(v => v.trim().toLowerCase());
    query[field] = (matchType === 'all') ? { $all: vals } : { $in: vals };
}

const parseJsonFields = (data, fields) => {
    fields.forEach(field => {
        if (data[field] && typeof data[field] === 'string') {
            try {
                data[field] = JSON.parse(data[field]);
            } catch (error) {
                console.error(`Error parsing field ${field}: `, error);
            }
        }
    });
};

const SPIRIT_GROUPS = {
    whiskey: ['whiskey', 'bourbon', 'rye', 'scotch'],
};

module.exports = { applyArrayFilter, parseJsonFields, SPIRIT_GROUPS };