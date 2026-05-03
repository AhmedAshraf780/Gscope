export interface BankDao {
  getBankMoney(gym_id: number): Promise<number>;
  addBank(gym_id: number, money: number): Promise<number | null>;
  updateBank(gym_id: number, money: number): Promise<number | null>;
}
