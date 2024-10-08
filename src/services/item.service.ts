import {Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/entites/items.entity';
import {ItemRepository} from 'src/repositories/items.repository'

@Injectable()
export class ItemService{
     constructor(
          @InjectRepository(Item)
          private readonly itemsRepository: ItemRepository,
     ){}

     async checkInventory(itemId: number, quantity: number): Promise<boolean>{
          const item = await this.itemsRepository.findOne({where: {id: itemId}});
          if(!item || item.stock < quantity){
               return false;
          }
          return true
     }

     async updateInventory(items:{ itemId: number; quantity: number }[]){
          const itemIds = items.map(item => item.itemId);
          const itemQuantitys = items.map(item => item.quantity);
          for(const itemId of itemIds){
               for(const itemQuantity of itemQuantitys){
                    const item = await this.itemsRepository.findOne({where: {id: itemId}});
                    item.stock = item.stock - itemQuantity 
                    await this.itemsRepository.save(item);
               }
          }
     }
}
export default ItemService;