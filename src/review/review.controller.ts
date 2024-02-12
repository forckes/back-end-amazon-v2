import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ReviewService } from './review.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { ReviewDto } from './review.dto'

@Controller('reviews')
export class ReviewController {
	constructor(private reviewService: ReviewService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll() {
		return this.reviewService.getAll()
	}

	@Get('average-by-product/:productId')
	async getAverage(@Param('productId') productId: number) {
		return this.reviewService.getAverageValueByProductId(+productId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('leave/:productId')
	@Auth()
	async leaveReview(
		@CurrentUser('id') userId: number,
		@Param('productId') productId: number,
		@Body() dto: ReviewDto
	) {
		return this.reviewService.create(userId, dto, +productId)
	}
}
