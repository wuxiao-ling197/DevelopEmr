
/**
 * 暂时没用，jobid发号器定义在redis.service里，
 * 可能等类似的方法逻辑多了就把逻辑处理部分全部提过来
 */

/**
 * job_id发号器
 * @param redisClient redis客户端
 * @returns 
 */
export async function generateJobId(redisClient) {
    return new Promise((resolve, reject) => {
        redisClient.incr('job_id_counter', (err, reply) => {
        if (err) reject(err);
        resolve(reply);
        });
    });
}