import prisma from '../src/lib/prisma.js';

async function main() {
    await prisma.athlete.deleteMany();

    const athletes = [
        { firstName: 'John', lastName: 'Doe', gender: 'Male', dateOfBirth: new Date('1995-06-15'), weightClass: 'Lightweight/60kg', licenseId: 'LIC-001', medicalOk: true },
        { firstName: 'Jane', lastName: 'Smith', gender: 'Female', dateOfBirth: new Date('1998-02-20'), weightClass: 'Welterweight/67kg', licenseId: 'LIC-002', medicalOk: false },
        { firstName: 'Mike', lastName: 'Johnson', gender: 'Male', dateOfBirth: new Date('1992-11-02'), weightClass: 'Middleweight/75kg', licenseId: 'LIC-003', medicalOk: true },
        { firstName: 'Emily', lastName: 'Davis', gender: 'Female', dateOfBirth: new Date('2000-04-12'), weightClass: 'Lightweight/60kg', licenseId: 'LIC-004', medicalOk: true },
        { firstName: 'David', lastName: 'Wilson', gender: 'Male', dateOfBirth: new Date('1996-09-08'), weightClass: 'Welterweight/67kg', licenseId: 'LIC-005', medicalOk: true },
        { firstName: 'Sarah', lastName: 'Brown', gender: 'Female', dateOfBirth: new Date('1994-12-30'), weightClass: 'Middleweight/75kg', licenseId: 'LIC-006', medicalOk: false },
        { firstName: 'Chris', lastName: 'Taylor', gender: 'Male', dateOfBirth: new Date('1997-05-21'), weightClass: 'Lightweight/60kg', licenseId: 'LIC-007', medicalOk: true },
        { firstName: 'Anna', lastName: 'Moore', gender: 'Female', dateOfBirth: new Date('1993-08-17'), weightClass: 'Welterweight/67kg', licenseId: 'LIC-008', medicalOk: true },
        { firstName: 'James', lastName: 'Anderson', gender: 'Male', dateOfBirth: new Date('1999-01-05'), weightClass: 'Middleweight/75kg', licenseId: 'LIC-009', medicalOk: false },
        { firstName: 'Olivia', lastName: 'Thomas', gender: 'Female', dateOfBirth: new Date('2001-03-11'), weightClass: 'Lightweight/60kg', licenseId: 'LIC-010', medicalOk: true },
    ];

    for (const athlete of athletes) {
        await prisma.athlete.create({ data: athlete });
    }
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());