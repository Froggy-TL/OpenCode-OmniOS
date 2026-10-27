export const runtimeEngine = {
  async execute(code: string, args: any) {
    try {
      const fn = new Function('args', code)
      return await fn(args)
    } catch (e: any) {
      console.error('RuntimeEngine execution error:', e)
      throw e
    }
  }
}
