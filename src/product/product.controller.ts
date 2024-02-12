import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ProductService } from './product.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { GetAllProductDto } from './dto/get-all.product.dto'
import { ProductDto } from './dto/products.dto'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: GetAllProductDto) {
		return this.productService.getAll(queryDto)
	}

	@Get('similar/:id')
	async getBySimilar(@Param('id') id: string) {
		return this.productService.getSimilar(+id)
	}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.productService.bySlug(slug)
	}

	@Get('by-category/:categorySlug')
	async getProductsByCategory(@Param('categorySlug') categorySlug: string) {
		return this.productService.byCategory(categorySlug)
	}

	@UsePipes(new ValidationPipe())
	@Auth('admin')
	@HttpCode(200)
	@Post()
	async createProduct() {
		return this.productService.create()
	}

	@UsePipes(new ValidationPipe())
	@Auth('admin')
	@HttpCode(200)
	@Put(':id')
	async updateProduct(@Param('id') id: string, @Body() dto: ProductDto) {
		return this.productService.update(+id, dto)
	}

	@Auth('admin')
	@HttpCode(200)
	@Delete(':id')
	async deleteProduct(@Param('id') id: string) {
		return this.productService.delete(+id)
	}

	@Auth('admin')
	@Get(':id')
	async getProduct(@Param('id') id: string) {
		return this.productService.byId(+id)
	}
}
