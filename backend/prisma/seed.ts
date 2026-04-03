import bcrypt from 'bcryptjs'
import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
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

  const categories = [
    { name: 'PCs', slug: 'pcs' },
    { name: 'Keyboards', slug: 'keyboards' },
    { name: 'Mice', slug: 'mice' },
    { name: 'Accessories', slug: 'accessories' }
  ]

  const createdCategories = await Promise.all(
    categories.map((c) =>
      prisma.category.upsert({
        where: { slug: c.slug },
        update: { name: c.name },
        create: c
      })
    )
  )

  const catBySlug = new Map(createdCategories.map((c) => [c.slug, c]))

  const products = [
    {
      name: 'Gaming PC - RTX 4070',
      description: 'High-performance gaming PC for 1440p and streaming.',
      price: 1699.99,
      stock: 5,
      categorySlug: 'pcs',
      images: [
        'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gaming%20desktop%20pc%20with%20rgb%20lighting%2C%20tempered%20glass%20case%2C%20studio%20product%20photo%2C%20clean%20background%2C%20sharp%20focus%2C%20modern%20ecommerce%20style&image_size=square'
      ]
    },
    {
      name: 'Mechanical Keyboard - TKL',
      description: 'Tenkeyless mechanical keyboard with hot-swap switches.',
      price: 129.99,
      stock: 30,
      categorySlug: 'keyboards',
      images: [
        'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mechanical%20keyboard%20tenkeyless%2C%20minimal%20black%20desk%2C%20studio%20product%20photo%2C%20clean%20lighting%2C%20sharp%20focus%2C%20modern%20ecommerce%20style&image_size=square'
      ]
    },
    {
      name: 'Wireless Gaming Mouse',
      description: 'Lightweight wireless mouse with adjustable DPI.',
      price: 79.99,
      stock: 40,
      categorySlug: 'mice',
      images: [
        'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=wireless%20gaming%20mouse%2C%20matte%20finish%2C%20studio%20product%20photo%2C%20clean%20background%2C%20sharp%20focus%2C%20modern%20ecommerce%20style&image_size=square'
      ]
    },
    {
      name: 'USB-C Hub 8-in-1',
      description: 'USB-C hub with HDMI, USB-A, and SD card slots.',
      price: 49.99,
      stock: 60,
      categorySlug: 'accessories',
      images: [
        'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=usb%20c%20hub%20adapter%2C%20aluminum%20finish%2C%20studio%20product%20photo%2C%20clean%20background%2C%20sharp%20focus%2C%20modern%20ecommerce%20style&image_size=square'
      ]
    }
  ]

  for (const p of products) {
    const category = catBySlug.get(p.categorySlug)
    if (!category) continue

    const existing = await prisma.product.findFirst({
      where: { name: p.name, categoryId: category.id }
    })

    const product =
      existing ??
      (await prisma.product.create({
        data: {
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          categoryId: category.id
        }
      }))

    await prisma.productImage.deleteMany({ where: { productId: product.id } })
    if (p.images.length > 0) {
      await prisma.productImage.createMany({
        data: p.images.map((url) => ({ url, productId: product.id }))
      })
    }
  }
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

