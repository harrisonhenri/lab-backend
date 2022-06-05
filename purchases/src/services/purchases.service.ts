import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { KafkaService } from 'src/messaging/kafka.service';

interface ICreatePurchase {
  customerId: string;
  productId: string;
}

@Injectable()
export class PurchasesService {
  constructor(
    private prisma: PrismaService,
    private kafkaService: KafkaService,
  ) {}

  listAllPurchases() {
    return this.prisma.purchases.findMany({ orderBy: { createdAt: 'desc' } });
  }

  listAllFromCustomer(customerId: string) {
    return this.prisma.purchases.findMany({
      where: {
        customerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createPurchase({ productId, customerId }: ICreatePurchase) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new Error('Product not found');

    const purchase = this.prisma.purchases.create({
      data: { customerId, productId },
    });

    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    this.kafkaService.emit('purchases.new-purchase', {
      customer: {
        authUserId: customer.authUserId,
      },
      product: {
        id: product.id,
        title: product.title,
        slug: product.slug,
      },
    });

    return purchase;
  }
}
