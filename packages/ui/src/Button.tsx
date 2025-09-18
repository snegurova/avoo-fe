import * as React from 'react'


export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>


export function Button({ children, ...props }: ButtonProps) {
return (
<button className="rounded-xl px-4 py-2 border shadow-sm hover:shadow-md transition" {...props}>
{children}
</button>
)
}
