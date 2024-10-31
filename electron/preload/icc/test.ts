import ffi, { types } from '@breush/ffi-napi'
import ref from '@breush/ref-napi'
import path from 'path'

const dylib = path.resolve('extraResources', process.platform, 'rust_lib')
console.log(dylib)
const MyDellDemo = new ffi.Library(dylib, {
  // 方法名必须与C函数名一致
  add: [
    'int', // 对应 C函数返回类型
    ['int', 'int'], // C函数参数列表
  ],
  ref_i32: [
    types.void,
    [ref.refType(types.int32)]
  ]
})
// console.log(MyDellDemo.add(1, 2))

export function add() {
  return MyDellDemo.add(1, 2)
}
export function test_ref() {
  const buf = ref.alloc(types.int32)
  MyDellDemo.ref_i32(buf)
  console.log(buf.deref())
}
