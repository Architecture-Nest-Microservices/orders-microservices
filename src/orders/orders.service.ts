import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { RpcException } from '@nestjs/microservices';
import { ChangeOrderStatusDto, OrderPaginationDto } from './dto';
import { stat } from 'fs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
    private readonly logger = new Logger(OrdersService.name);
    async onModuleInit() {
        await this.$connect();
        this.logger.log('Connected to database');
    }

    create(createOrderDto: CreateOrderDto) {
        return this.order.create({
            data: createOrderDto
        });
    }

    async findAll(orderPaginationDto: OrderPaginationDto) {
        const { page, limit, status } = orderPaginationDto;
        const totalPages = await this.order.count({
            where: status ? { status } : undefined
        });

        return {
            data: await this.order.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: status ? { status } : undefined
            }),
            meta: {
                total: totalPages,
                lastPage: Math.ceil(totalPages / limit)
            }
        };
    }

    async findOne(id: string) {
        const order = await this.order.findFirst({
            where: { id }
        });
        if (!order)
            throw new RpcException({
                message: `Order with id ${id} not found`,
                code: HttpStatus.NOT_FOUND
            });

        return order;
    }

    async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
        const { id, status } = changeOrderStatusDto;
        const order = await this.findOne(id);

        if (status === order.status) return order;

        return this.order.update({
            where: { id },
            data: { status }
        });
    }
}
