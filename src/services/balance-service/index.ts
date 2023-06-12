import balanceRepository from '@/repositories/balance-repository';

export async function balanceCalcByUserId(userId: number) {
    let inputsSum, outputsSum;
    const inputs = await balanceRepository.existTransactionsByUserId(userId, 'INPUT');
    
    if(inputs.length) {
        inputsSum = await balanceRepository.findTransactionsByUserId(userId, 'INPUT');
        inputsSum = inputsSum[0]._sum.value;
    } else {
        inputsSum = 0;
    }
    const outputs = await balanceRepository.existTransactionsByUserId(userId, 'OUTPUT');
    if(outputs.length) {
        outputsSum = await balanceRepository.findTransactionsByUserId(userId, 'OUTPUT');
        outputsSum = outputsSum[0]._sum.value;
    } else {
        outputsSum = 0;
    }
    
    const value = (-Number(outputsSum) + Number(inputsSum)).toFixed(2);
    
    return { value };
}

const balanceService = {
    balanceCalcByUserId,
};

export default balanceService;