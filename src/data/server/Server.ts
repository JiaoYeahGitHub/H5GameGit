/**
 *
 * @author 
 *
 */
class Server {

    public id: number;

    public name: string;

    public state: SERVER_STATE;

    public constructor() {
    }
}

enum SERVER_STATE {
    NEW = 0,      //新区
    HOT = 1,      //火爆
    MAINTAIN = 2, //维护
}