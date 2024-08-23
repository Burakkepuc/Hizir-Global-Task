const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const size = await prisma.attributes.createMany({
    data: [
      { id: 1, name: "Color" },
      { id: 2, name: "Size" },
      { id: 3, name: "Fabric" }
    ]
  })



  const createManyAttribute = await prisma.attributeValues.createMany({
    data: [
      { id: 1, attribute_id: 1, name: 'Red' },
      { id: 2, attribute_id: 1, name: 'Green' },
      { id: 3, attribute_id: 1, name: 'Blue' },
      { id: 4, attribute_id: 2, name: 'Small' },
      { id: 5, attribute_id: 2, name: 'Medium' },
      { id: 6, attribute_id: 2, name: 'Large' },
      { id: 7, attribute_id: 3, name: 'Linen' },
      { id: 8, attribute_id: 3, name: 'Cotton' },
    ],
    skipDuplicates: true,
  })

  console.log("Seeding done")
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })