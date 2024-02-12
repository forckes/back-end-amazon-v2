import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CategoryDto } from './category.dto'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	async getAll() {
		return this.categoryService.getAll()
	}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.categoryService.bySlug(slug)
	}

	@Auth()
	@Get(':id')
	async getById(@Param('id') id: string) {
		return this.categoryService.byId(+id)
	}

	@Auth('admin')
	@HttpCode(200)
	@Post()
	async create() {
		return this.categoryService.create()
	}

	@UsePipes(new ValidationPipe())
	@Auth('admin')
	@HttpCode(200)
	@Put(':id')
	async update(@Param('id') categoryId: string, @Body() dto: CategoryDto) {
		return this.categoryService.update(+categoryId, dto)
	}

	@Auth('admin')
	@HttpCode(200)
	@Delete(':id')
	async delete(@Param('id') categoryId: string) {
		return this.categoryService.delete(+categoryId)
	}
}
