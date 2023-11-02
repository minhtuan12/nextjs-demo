import {Category} from "@/app/models";

const categories = [
    {
        name: 'Khác',
        description: 'Các danh mục khác'
    }
]

export default async function () {
    try {
        for (const category of categories) {
            await Category.findOneAndUpdate(
                {
                    name: category.name,
                },
                {
                    $set: {...category}
                },
                {
                    upsert: true,
                    new: true,
                }
            );
        }

        console.log("Seed category successfully")
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}