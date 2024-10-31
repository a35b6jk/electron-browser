import ffi, { types } from '@breush/ffi-napi'
import ref from '@breush/ref-napi'
import path from 'path'

const dylib = path.resolve(
  'extraResources',
  process.platform,
  'yibaoka',
  'SSCardDriver_wz'
)

// ref.readCString
// iReadCardBas_wz

// 使用 @breush/ref-napi 创建一个引用字符创类型

const icc = ffi.Library(dylib, {
  // 方法名必须与C函数名一致
  iReadCardBas: [
    ref.types.void, // 对应 C函数返回类型
    [ref.refType(ref.types.CString)], // C函数参数列表
  ],
})

export function read() {
  const b = ref.alloc(types.CString)
  icc.iReadCardBas(b)
}

// var reft = ref.ref(buf)
// buf.type = ref.types.CString
// const type = ref.getType(buf)
// // const a = buf.ref()
// // var buf1 = ref.alloc(ref.types.CString, type)

// icc.iReadCardBas_wz(buf.ref())
