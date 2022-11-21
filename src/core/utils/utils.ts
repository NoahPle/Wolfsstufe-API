export const convertFirestoreDate = (json) => {
    if (json) {
        for (const field of Object.getOwnPropertyNames(json)) {
            if (json[field] && typeof json[field] === 'object' && typeof json[field].toDate === 'function') {
                json[field] = json[field].toDate();
            } else if (json[field] && typeof json[field] === 'object') {
                convertFirestoreDate(json[field]);
            }
        }
    }
};
