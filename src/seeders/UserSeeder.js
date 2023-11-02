import {User, USER_TYPE} from "@/app/models";
import {generatePassword} from "@/utils";

const admin = {
    username: 're-share-admin',
    name: 'Admin',
    phone: '0987654321',
    email: 'admin.reshare@gmail.com',
    avatar: null,
    password: 'Admin@123',
    type: USER_TYPE.ADMIN
}

export default async function () {
    try {
        await User.findOneAndUpdate(
            {
                email: admin.email,
            },
            {
                $set: {
                    ...admin,
                    password: await generatePassword(admin.password),
                },
            },
            {
                upsert: true,
                new: true,
            }
        );
        console.log("Seed user successfully")
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}