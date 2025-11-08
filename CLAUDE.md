In all interactions and commit messages, be extremely concise and sacrifice grammar for the sake of concision.
Design functions with simple input arguments and simple return values.
Write redundant code if it improves readability. Do not write preemptively extensible code.
Write functional code. Do not create classes when functions suffice.

## Code Clarity

Do not use default arguments for internal functions. Make all internal function calls explicit.
Do not use None/null as an possible argument type. Resolve unknown arguments immediately.
Split complex logic into multiple functions. Code becomes hard to understand when if statements, for loops, and try-except blocks appear in close proximity. Easy to understand code does not have many if statements, for loops, and try-except blocks in close proximity.
When it is possible, try to create easy do understand code. Break complex code into separate functions.

## Validation and Safety

- Validate all inputs at the entry point. Validate and fail as soon as possible.
- Try to write pure functions. Avoid side effects and mutable state wherever possible. When modifying the state, try to use higher order functions to avoid mutating the state directly.
- Do not use global state.

## Import and Structure Rules

Place all imports at the top of the file. Do not use local imports or function definitions inside if statements, function definitions, or try blocks.

Use bun / vite / typescript
The project uses: nextjs, tailwind, shadcn, zustand, tanstack-query, betterauth, drizzle
