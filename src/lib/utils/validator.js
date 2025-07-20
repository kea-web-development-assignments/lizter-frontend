export const userValidation = {
    username: {
        title: 'Username must be between 3-20 alphanumerical characters long',
        pattern: '^[a-zA-Z0-9]{3,20}$',
    },
    firstName: {
        title: 'First name must be between 2-30 characters long',
        pattern: '^[a-zA-Z]{2,30}$',
    },
    lastName: {
        title: 'Last name must be between 2-30 characters long',
        pattern: '^[a-zA-Z]{2,30}$',
    },
    email: {
        title: 'Email must be at least 5 characters long and contain an "@" and a period(.)',
        pattern: '^[^@]+@[^@]+\\.[^@]+$',
    },
    password: {
        title: 'Password must be 8-20 characters long, as well as include at least one uppercase and lowercase character, a number, and a special character (!@#$%&*)',
        pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%&*])[A-Za-z0-9!@#$%&*]{8,20}$',
    },
};

export const itemValidation = {
    name: {
        title: 'Name must be between 1-100 alphanumerical characters long, including dashes, parentheses, and colons',
        pattern: '^[a-zA-Z0-9 :\\(\\)\\-]{1,100}$',
    },
    description: {
        title: 'Description must be between 5-1000 characters long',
        pattern: '^[\\s\\S]{5,1000}$',
    },
    releaseDate: {
        title: 'Release date must be a valid date (dd-mm-yyyy)',
        pattern: '^[0-9]{2}\\-[0-9]{2}\\-[0-9]{4}$',
    },
};
