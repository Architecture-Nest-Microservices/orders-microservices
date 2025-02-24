import { IsEnum, IsOptional } from 'class-validator';
import { PagintaionDto } from 'src/common';
import { OrderStatusList } from '../enum';
import { OrderStatus } from '@prisma/client';

export class OrderPaginationDto extends PagintaionDto {
    @IsOptional()
    @IsEnum(OrderStatusList, {
        message: `Possible status values: ${OrderStatusList}`
    })
    status: OrderStatus;
}
