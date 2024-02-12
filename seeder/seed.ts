import { faker } from '@faker-js/faker'
import { PrismaClient, Product } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

const createProducts = async (quantity: number) => {
	const products: Product[] = []
	const generatedNames: string[] = []

	for (let i = 0; i < quantity; i++) {
		let productName: string
		let isDuplicate = true

		while (isDuplicate) {
			productName = faker.commerce.productName()

			if (!generatedNames.includes(productName)) {
				isDuplicate = false
				generatedNames.push(productName)
			}
		}

		const categoryName = faker.commerce.department()

		const product = await prisma.product.create({
			data: {
				name: productName,
				slug: faker.helpers.slugify(productName).toLowerCase(),
				description: faker.commerce.productDescription(),
				price: +faker.commerce.price({ min: 10, max: 10000, dec: 0 }),
				images: Array.from({
					length: faker.number.int({ min: 2, max: 6 })
				}).map(() => `/uploads/${faker.number.int({ min: 1, max: 10 })}.jpg`),
				category: {
					create: {
						name: categoryName,
						slug: faker.helpers.slugify(categoryName).toLowerCase()
					}
				},
				reviews: {
					create: [
						{
							rating: faker.number.int({ min: 1, max: 5 }),
							text: faker.lorem.paragraph(),
							user: {
								connect: {
									id: 1
								}
							}
						},
						{
							rating: faker.number.int({ min: 1, max: 5 }),
							text: faker.lorem.paragraph(),
							user: {
								connect: {
									id: 2
								}
							}
						},
						{
							rating: faker.number.int({ min: 1, max: 5 }),
							text: faker.lorem.paragraph(),
							user: {
								connect: {
									id: 3
								}
							}
						}
					]
				}
			}
		})

		products.push(product)
	}

	console.log(`Created ${products.length} products`)
}

async function main() {
	console.log('start seeding...')
	await createProducts(10)
}

main()
	.catch(e => console.log(e))
	.finally(async () => {
		await prisma.$disconnect
	})
