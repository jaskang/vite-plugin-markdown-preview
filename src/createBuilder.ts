export function createBuilder(name: string, lifecycle: string) {
  return {
    options: () => {
      return {
        initializer: (initializer?: any) => {
          return {
            handler: (handler: any) => {
              return {
                meta: (meta: any) => {
                  const registration: any = {
                    ...meta,
                    name,
                    lifecycle,
                    handler,
                    initializer,
                  }
                  return (options?: any) => () => ({ ...registration, options })
                },
              }
            },
          }
        },
      }
    },
  }
}
