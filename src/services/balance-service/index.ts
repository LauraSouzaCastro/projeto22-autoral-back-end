import balanceRepository from '../../repositories/balance-repository';

export async function balanceCalcByUserId(userId: number) {
    const balance = await balanceRepository.findBalanceByUserId(userId);
    
    if(!balance) return { value: 0.00 };

    return { value: balance.value.toFixed(2) };
}

const balanceService = {
    balanceCalcByUserId,
};

export default balanceService;