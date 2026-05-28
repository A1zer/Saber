import bcrypt from 'bcryptjs'; // nebo const bcrypt = require('bcrypt'); podle vašeho projektu

const generateAdminHash = async () => {
    const mojeTajneHeslo = "adminadmin";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mojeTajneHeslo, salt);

    console.log("-------------------------------");
    console.log("Tvůj nový hash pro databázi:");
    console.log(hashedPassword);
    console.log("-------------------------------");
};

generateAdminHash();