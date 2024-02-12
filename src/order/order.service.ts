import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { OrderDto } from './order.dto'
import { returnProductObject } from 'src/product/return-product.object'

@Injectable()
export class OrderService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return this.prisma.order.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				items: {
					include: {
						product: {
							select: returnProductObject
						}
					}
				}
			}
		})
	}

	async getByUserId(userId: number) {
		return this.prisma.order.findMany({
			where: {
				userId
			},
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				items: {
					include: {
						product: {
							select: returnProductObject
						}
					}
				}
			}
		})
	}
	async placeOrder(dto: OrderDto, userId: number) {
		const total = dto.items.reduce((acc, item) => {
			return acc + item.price * item.quantity
		}, 0)
		const order = await this.prisma.order.create({
			data: {
				status: dto.status,
				total,
				items: {
					create: dto.items
				},
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
		// const payment = await PaymentMethodChangeEvent.createPayment({})
		//Place for payment

		return order
		//return payment
		//we need to return payment instead of order
	}
}
