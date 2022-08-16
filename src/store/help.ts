//实现使用mutations/getters/actions时出现模块对应方法提示
//主要步骤就是将模块对应的mutations/getters/actions的所有方法获取到然后和模块名拼接，然后再将原生的mutations/getters/actions替换为我们自己实现的mutations/getters/actions，然后再在创建store的时候使用

import { CommitOptions, DispatchOptions, Store as VuexStore } from 'vuex'
import { modules, RootState } from './index'
//泛型的使用方法类似于函数，相当于一层一层传递参数

//获取modules的类型
type Modules = typeof modules

//获取所有模块下的mutations
//3、获取当前模块的mutations字段内容（T extends { mutations: infer G }表示当前模块内容T对象必须包含mutations字段,如果包含mutations，就将mutations类型指向G）
type GetMutation<T> = T extends { mutations: infer G } ? G : never;
type GetMutations<T> = {
    //2、获取当前模块的所有内容（keyof获取Modules模块的key（即模块名））
    [K in keyof T]: GetMutation<T[K]>
}
//1、调用GetMutations<Modules>获取仓库所有模块的全部内容，最后一层一层执行返回所有模块的mutations
type mutationsObj = GetMutations<Modules>

//获取所有模块下的actions
type GetAction<T> = T extends { actions: infer G } ? G : never;
type GetActions<T> = {
    [K in keyof T]: GetAction<T[K]>
}
type actionsObj = GetActions<Modules>

//获取所有模块下的getters
type GetGetter<T> = T extends { getters: infer G } ? G : never;
type GetGetters<T> = {
    [K in keyof T]: GetGetter<T[K]>
}
type gettersObj = GetGetters<Modules>

// 拼接模块名/模块方法
// 4、tabs/addTabe  menu/setCount
type AddPrefix<prefix, keys> = `${prefix & string}/${keys & string}`
//3、T是当前模块对应的mutations方法，K是当前模块的模块名
type Getkey<T, K> = AddPrefix<K, keyof T>;
//2、T是所有模块对应的mutations方法，通过{模块名:拼接字符串}[keyof T]的方式将模块名对应的拼接的字符串获取
type Getkeys<T> = {
    //K是当前模块的模块名，T[K]是当前模块对应的mutations方法
    [K in keyof T]: Getkey<T[K], K>
}[keyof T]
//测试：1、mutationsObj是所有模块的mutations，执行Getkeys传递mutationsObj
type ss = Getkeys<mutationsObj>

//获取当前模块下每个函数的返回值
//T[A & keyof T]代表在T中存在当前模块名且返回当前模块名的方法对象，[B & keyof T[A & keyof T]]代表返回当前模块名对应的当前方法的实现
type GetFunc<T, A, B> = T[A & keyof T][B & keyof T[A & keyof T]];
type GetMethod<T> = {
    //将获取到的模块对应的mutations/getters/actions的所有方法以对象形式绑定方法的实现
    //T是所有模块的当前属性（mutations/getters/actions）对应的所有方法，K是模块属性对应的拼接的模块名/模块方法，A是模块名，B是模块方法名
    //通过in来确保K存在Getkeys<T>里面并循环遍历Getkeys<T>获取所有方法
    [K in Getkeys<T>]: K extends `${infer A}/${infer B}` ? GetFunc<T, A, B> : unknown
}
//获取mutaions的所有方法
type GetMutationsFunc = GetMethod<mutationsObj>;
//获取actions的所有方法
type GetActionsFunc = GetMethod<actionsObj>;
//获取getters的所有方法
type GetGettersFunc = GetMethod<gettersObj>;

//将vuex提供的'commit' | 'getters' | 'dispatch'方法替换为自己实现的有提示信息的'commit' | 'getters' | 'dispatch'方法
//通过Omit来剔除vuex的方法，通过&来添加自己实现的方法
export type CommonStore = Omit<VuexStore<RootState>, 'commit' | 'getters' | 'dispatch'>
    &
{
    //自己实现的commit方法
    commit<K extends keyof GetMutationsFunc, P extends Parameters<GetMutationsFunc[K]>[1]>(
        key: K,
        payload?: P,
        options?: CommitOptions
    ): ReturnType<GetMutationsFunc[K]>
}
    &
{
    //自己实现的getters方法
    getters: {
        [K in keyof GetGettersFunc]: ReturnType<GetGettersFunc[K]>
    }
}
    &
{
    //自己实现的dispatch方法
    dispatch<K extends keyof GetActionsFunc>(
        key: K,
        payload?: Parameters<GetActionsFunc[K]>[1],
        options?: DispatchOptions
    ): ReturnType<GetActionsFunc[K]>
}