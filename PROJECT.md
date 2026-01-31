### About This Document
This document is **not user documentation**

If you're looking for instructions on how to install, configure, or use the bot, please see the [README](./README.md).

If you're interested in contributing or understanding the project at a deeper level, this document provides useful context. It outlines the project's goals, constraints, and architectural direction, which helps ensure future changes stay aligned with its intent.


### Overview
This project explores a scalable, modular architecture for Discord bots that avoids the downsides of both monolithic designs and fully separated multi-process bots.

Instead of running multiple bots as independent Node.js processes—or cramming everything into one massive codebase—this system allows multiple independent bot cores to run inside a single shared runtime and connection.

The goal is modularity without fragmentation.  

---

### Why This Exists
I've experimented with several bot architectures over time:
* **Monolithic bots**  
  Simple to run, but quickly become unmaintainable as features grow.
* **Split "core" bots (multi-process)**
  Better organization, but introduces
  * Duplicate gateway connections
  * No shared state
  * No inter-core communication
  * Unnecessary resource overhead  

This project exists to combine the strengths of both approaches while avoiding their weaknesses.

---

### How It Works
* Each bot is developed **normally**, as a self-contained unit.
* Bots are placed into the `bots` directory.
* Instead of running separate Node.js processes, all bots are:
  * Loaded into a **shared runtime**
  * Connected through **one Discord gateway connection**
* Each bot remains modular and isolated in design, but can:
  * Share state
  * Communicate with other cores
  * Cooperate within a unified system

The end result is a **single bot process composed of independent cores**, without turning into a monolith or spawning multiple competeing processes.

---

### Old vs New
This project is a return to an earlier idea:  
[Dot Bot Manager](https://github.com/BackwardsUser/Dot-Bot-Manager/)

That project was shut down after its scope expanded far beyond what I could realitically manage at the time. This iteration is intentionally more focused:
* Less "do everything"
* More **developer-oriented tooling**
* Strong emphasis on modularity and clarity

Eventually, this project may evolve back into Dot Bot Manager—but this time with a much more constrained and achievable scope.

---

### What This *Isn't*

This is **not** just another command-file loader or simple plugin system.

While I've used command-based architectures in the past (and they do work), more advanced bot features often benefit from tighter integration and clearer structure. For my workflow, working within a single logical unit—rather than spreading logic across many loosely connected files—has proven easier to reason about.

That said:  
* Multi-file bots **are supported**, including command-file loaders
* The system’s job is to merge multiple bots into one runtime, not to restrict how they’re written

This project focuses on process unification, not enforcing a specific coding style.

---

### What I Hope to Achieve
The long-term vision is simple:
* Take a standard bot (see `example/simplebot`)
* Drop it into the project (the `bots` folder)
* Have its functionality seamlessly merged into the "grand bot"

**Key Goals**
* **Unified configuration system**  
  A shared config layer accessible by all sub-bots, with entries modifiable at a server level.
* **Shared datastore**  
  Each core should be able to:
  * Create it's own stores
  * Read for and write to other cores' data when permitted
* **Inter-core communication**  
  Bots should be aware of—and able to interact with—each other without tight coupling.

The exact implementation is still evolving, but the aim is a clean, flexible foundation that scales with complexity instead of fighting it.