import { v4 as uuidv4 } from 'uuid'
import type { ExampleCode } from './types'
import { ScopingFeature } from './types'

export const exampleCodes: ExampleCode[] = [
  {
    id: 'lexical-scope',
    title: 'Lexical Scope Example',
    description: 'Demonstrates how lexical scoping works in JavaScript',
    feature: ScopingFeature.LEXICAL_SCOPE,
    code: `// Global scope
const globalVar = "I'm global";

function outerFunction() {
  // outerFunction scope
  const outerVar = "I'm from outer";
  
  function innerFunction() {
    // innerFunction scope
    const innerVar = "I'm from inner";
    
    console.log(innerVar);    // Own scope
    console.log(outerVar);    // Parent scope
    console.log(globalVar);   // Global scope
  }
  
  innerFunction();
  
  console.log(outerVar);      // Own scope
  console.log(globalVar);     // Global scope
  // console.log(innerVar);   // Error: not accessible
}

outerFunction();`,
    steps: [
      {
        lineNumber: 1,
        feature: ScopingFeature.LEXICAL_SCOPE,
        description: 'Code execution starts in the global scope.',
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [],
              children: []
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'global'
        }
      },
      {
        lineNumber: 2,
        feature: ScopingFeature.LEXICAL_SCOPE,
        description: 'Declaring a constant in the global scope.',
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'globalVar',
                  value: "I'm global",
                  type: 'const'
                }
              ],
              children: []
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'global'
        }
      },
      {
        lineNumber: 4,
        feature: ScopingFeature.LEXICAL_SCOPE,
        description: 'Defining outerFunction in the global scope.',
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'globalVar',
                  value: "I'm global",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'outerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              children: []
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'global'
        }
      },
      {
        lineNumber: 22,
        feature: ScopingFeature.LEXICAL_SCOPE,
        description: 'Calling outerFunction from the global scope.',
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'globalVar',
                  value: "I'm global",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'outerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              children: []
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'global'
        }
      },
      {
        lineNumber: 4,
        feature: ScopingFeature.LEXICAL_SCOPE,
        description: 'Entering outerFunction execution context.',
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'globalVar',
                  value: "I'm global",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'outerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              children: ['outer']
            },
            'outer': {
              id: 'outer',
              name: 'outerFunction Scope',
              variables: [],
              parent: 'global',
              children: []
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'outer'
        }
      },
      {
        lineNumber: 6,
        feature: ScopingFeature.LEXICAL_SCOPE,
        description: 'Declaring a constant in the outerFunction scope.',
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'globalVar',
                  value: "I'm global",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'outerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              children: ['outer']
            },
            'outer': {
              id: 'outer',
              name: 'outerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'outerVar',
                  value: "I'm from outer",
                  type: 'const'
                }
              ],
              parent: 'global',
              children: []
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'outer'
        }
      },
      {
        lineNumber: 8,
        feature: ScopingFeature.LEXICAL_SCOPE,
        description: 'Defining innerFunction in the outerFunction scope.',
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'globalVar',
                  value: "I'm global",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'outerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              children: ['outer']
            },
            'outer': {
              id: 'outer',
              name: 'outerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'outerVar',
                  value: "I'm from outer",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'innerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              parent: 'global',
              children: []
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'outer'
        }
      },
      {
        lineNumber: 16,
        feature: ScopingFeature.LEXICAL_SCOPE,
        description: 'Calling innerFunction from the outerFunction scope.',
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'globalVar',
                  value: "I'm global",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'outerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              children: ['outer']
            },
            'outer': {
              id: 'outer',
              name: 'outerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'outerVar',
                  value: "I'm from outer",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'innerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              parent: 'global',
              children: []
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'outer'
        }
      },
      {
        lineNumber: 8,
        feature: ScopingFeature.LEXICAL_SCOPE,
        description: 'Entering innerFunction execution context.',
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'globalVar',
                  value: "I'm global",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'outerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              children: ['outer']
            },
            'outer': {
              id: 'outer',
              name: 'outerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'outerVar',
                  value: "I'm from outer",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'innerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              parent: 'global',
              children: ['inner']
            },
            'inner': {
              id: 'inner',
              name: 'innerFunction Scope',
              variables: [],
              parent: 'outer',
              children: []
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'inner'
        }
      },
      {
        lineNumber: 10,
        feature: ScopingFeature.LEXICAL_SCOPE,
        description: 'Declaring a constant in the innerFunction scope.',
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'globalVar',
                  value: "I'm global",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'outerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              children: ['outer']
            },
            'outer': {
              id: 'outer',
              name: 'outerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'outerVar',
                  value: "I'm from outer",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'innerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              parent: 'global',
              children: ['inner']
            },
            'inner': {
              id: 'inner',
              name: 'innerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'innerVar',
                  value: "I'm from inner",
                  type: 'const'
                }
              ],
              parent: 'outer',
              children: []
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'inner'
        }
      },
      {
        lineNumber: 12,
        feature: ScopingFeature.LEXICAL_SCOPE,
        description: 'Accessing innerVar from innerFunction scope (own scope).',
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'globalVar',
                  value: "I'm global",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'outerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              children: ['outer']
            },
            'outer': {
              id: 'outer',
              name: 'outerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'outerVar',
                  value: "I'm from outer",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'innerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              parent: 'global',
              children: ['inner']
            },
            'inner': {
              id: 'inner',
              name: 'innerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'innerVar',
                  value: "I'm from inner",
                  type: 'const'
                }
              ],
              parent: 'outer',
              children: []
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'inner'
        }
      },
      {
        lineNumber: 13,
        feature: ScopingFeature.LEXICAL_SCOPE,
        description: 'Accessing outerVar from innerFunction scope (parent scope).',
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'globalVar',
                  value: "I'm global",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'outerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              children: ['outer']
            },
            'outer': {
              id: 'outer',
              name: 'outerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'outerVar',
                  value: "I'm from outer",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'innerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              parent: 'global',
              children: ['inner']
            },
            'inner': {
              id: 'inner',
              name: 'innerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'innerVar',
                  value: "I'm from inner",
                  type: 'const'
                }
              ],
              parent: 'outer',
              children: []
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'inner'
        }
      },
      {
        lineNumber: 14,
        feature: ScopingFeature.LEXICAL_SCOPE,
        description: 'Accessing globalVar from innerFunction scope (global scope).',
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'globalVar',
                  value: "I'm global",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'outerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              children: ['outer']
            },
            'outer': {
              id: 'outer',
              name: 'outerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'outerVar',
                  value: "I'm from outer",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'innerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              parent: 'global',
              children: ['inner']
            },
            'inner': {
              id: 'inner',
              name: 'innerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'innerVar',
                  value: "I'm from inner",
                  type: 'const'
                }
              ],
              parent: 'outer',
              children: []
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'inner'
        }
      },
      {
        lineNumber: 16,
        feature: ScopingFeature.LEXICAL_SCOPE,
        description: 'Exiting innerFunction and returning to outerFunction scope.',
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'globalVar',
                  value: "I'm global",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'outerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              children: ['outer']
            },
            'outer': {
              id: 'outer',
              name: 'outerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'outerVar',
                  value: "I'm from outer",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'innerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              parent: 'global',
              children: ['inner']
            },
            'inner': {
              id: 'inner',
              name: 'innerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'innerVar',
                  value: "I'm from inner",
                  type: 'const'
                }
              ],
              parent: 'outer',
              children: []
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'outer'
        }
      },
      {
        lineNumber: 18,
        feature: ScopingFeature.LEXICAL_SCOPE,
        description: 'Accessing outerVar from outerFunction scope (own scope).',
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'globalVar',
                  value: "I'm global",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'outerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              children: ['outer']
            },
            'outer': {
              id: 'outer',
              name: 'outerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'outerVar',
                  value: "I'm from outer",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'innerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              parent: 'global',
              children: ['inner']
            },
            'inner': {
              id: 'inner',
              name: 'innerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'innerVar',
                  value: "I'm from inner",
                  type: 'const'
                }
              ],
              parent: 'outer',
              children: []
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'outer'
        }
      },
      {
        lineNumber: 19,
        feature: ScopingFeature.LEXICAL_SCOPE,
        description: 'Accessing globalVar from outerFunction scope (global scope).',
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'globalVar',
                  value: "I'm global",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'outerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              children: ['outer']
            },
            'outer': {
              id: 'outer',
              name: 'outerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'outerVar',
                  value: "I'm from outer",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'innerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              parent: 'global',
              children: ['inner']
            },
            'inner': {
              id: 'inner',
              name: 'innerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'innerVar',
                  value: "I'm from inner",
                  type: 'const'
                }
              ],
              parent: 'outer',
              children: []
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'outer'
        }
      },
      {
        lineNumber: 20,
        feature: ScopingFeature.LEXICAL_SCOPE,
        description: 'Cannot access innerVar from outerFunction scope (child scope).',
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'globalVar',
                  value: "I'm global",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'outerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              children: ['outer']
            },
            'outer': {
              id: 'outer',
              name: 'outerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'outerVar',
                  value: "I'm from outer",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'innerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              parent: 'global',
              children: ['inner']
            },
            'inner': {
              id: 'inner',
              name: 'innerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'innerVar',
                  value: "I'm from inner",
                  type: 'const'
                }
              ],
              parent: 'outer',
              children: []
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'outer'
        }
      },
      {
        lineNumber: 22,
        feature: ScopingFeature.LEXICAL_SCOPE,
        description: 'Exiting outerFunction and returning to global scope.',
        scopeChain: {
          scopes: {
            'global': {
              id: 'global',
              name: 'Global Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'globalVar',
                  value: "I'm global",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'outerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              children: ['outer']
            },
            'outer': {
              id: 'outer',
              name: 'outerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'outerVar',
                  value: "I'm from outer",
                  type: 'const'
                },
                {
                  id: uuidv4(),
                  name: 'innerFunction',
                  value: 'function',
                  type: 'function'
                }
              ],
              parent: 'global',
              children: ['inner']
            },
            'inner': {
              id: 'inner',
              name: 'innerFunction Scope',
              variables: [
                {
                  id: uuidv4(),
                  name: 'innerVar',
                  value: "I'm from inner",
                  type: 'const'
                }
              ],
              parent: 'outer',
              children: []
            }
          },
          rootScopeId: 'global',
          activeScopeId: 'global'
        }
      }
    ]
  },
  // Add more examples here for closures, hoisting, this binding, etc.
] 