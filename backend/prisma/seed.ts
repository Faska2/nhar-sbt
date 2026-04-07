import bcrypt from 'bcryptjs'
import { PrismaClient, UserRole } from '@prisma/client'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const prisma = new PrismaClient()

async function main() {
  // 1. Setup Admin & Client users
  const adminEmail = 'admin@example.com'
  const clientEmail = 'client@example.com'
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10)
  const clientPasswordHash = await bcrypt.hash('Client123!', 10)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: UserRole.ADMIN },
    create: {
      email: adminEmail,
      name: 'Admin',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN
    }
  })

  await prisma.user.upsert({
    where: { email: clientEmail },
    update: {},
    create: {
      email: clientEmail,
      name: 'Client',
      passwordHash: clientPasswordHash,
      role: UserRole.CLIENT
    }
  })

  // 2. Load data from data.json
  const dataPath = path.join(__dirname, '../data.json')
  const rawData = await fs.readFile(dataPath, 'utf-8')
  const jsonData = JSON.parse(rawData)
  const jsonProducts = jsonData.products || []

  console.log(`Found ${jsonProducts.length} products in data.json`)

  // 3. Extract and create Categories
  const categoryNames = Array.from(new Set(jsonProducts.map((p: any) => p.category))) as string[]
  
  const categoriesMap = new Map<string, string>() // Category Name -> ID

  for (const name of categoryNames) {
    const slug = name.toLowerCase().replace(/\s+/g, '-')
    const cat = await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug }
    })
    categoriesMap.set(name, cat.id)
    console.log(`Synced Category: ${name}`)
  }

  // 4. Create Products and Images
  for (const p of jsonProducts) {
    const categoryId = categoriesMap.get(p.category)
    if (!categoryId) continue

    const product = await prisma.product.create({
      data: {
        name: p.title,
        description: p.description,
        price: p.price,
        stock: p.stock,
        categoryId: categoryId,
        images: {
          create: p.images.map((url: string) => ({ url }))
        }
      }
    })
    console.log(`Created Product: ${product.name}`)
  }

  console.log('Seed completed successfully!')
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
