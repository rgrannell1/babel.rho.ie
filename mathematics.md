# The Mathematics of the Library of Babel

Chapter-by-chapter summary of the mathematical findings in William Goldbloom Bloch's
*The Unimaginable Mathematics of Borges' Library of Babel* (Oxford University Press, 2008),
as they pertain to the properties of the Library itself.

Source: `~/Drive/unimaginable-mathematics.pdf`. Summaries generated per-chapter by
Claude Haiku agents reading the original text.

## Chapter 1 — Combinatorics: Contemplating Variations of the 23 Letters

### Core Library dimensions

Each book in Borges' Library contains **1,312,000 orthographic slots** (410 pages × 40 lines × 80 characters per line). With **25 available orthographic symbols** (the 23 letters of the alphabet plus space and punctuation), the total number of distinct volumes is **25^1,312,000**, which converts to approximately **10^1,834,097** in power-of-10 notation.

### Expanded scope with spine variations

Accounting for the minimum of 19 orthographic symbols that appear on each book's spine multiplies the Library by a factor of at least **25^19 = 363,797,880,709,171,295,166,015,625**. This modest spine variation expands the collection more than 300 septillion times.

### Combinatorial subsets

Within this vast structure lie staggering numbers of specialized subsets: books containing exactly one instance of a single letter *h* (with the rest filled by *g*) comprise 860,671,344,000 distinct volumes. Books with 16 instances of *h* total approximately **3.7 × 10^84** — already far exceeding the physical capacity of our universe if each book occupied atomic dimensions.

### Physical impossibility

Bloch demonstrates that if the observable universe were a cube of 10^27 meters per side and could hold ~1,000 books per cubic meter, it would contain at most **10^84 books**. The Library's 10^1,834,097 books vastly exceeds this bound, making physical traversal impossible: a librarian walking 100 km daily for 100 years covers negligible distance compared to light's journey in 15 billion years across the Library.

## Chapter 2 — Information Theory: Cataloging the Collection

### Library composition

- Each book contains 1,312,000 orthographic symbols from a 25-character alphabet
- Total distinct volumes: 25^1,312,000
- Each hexagon contains 640 books (4 walls × 20 shelves × 32 books per shelf)
- Approximately 25^1,311,997 (roughly 10^1,834,095 in decimal digits) hexagons required to hold all volumes

### Divisibility problem

Since 25^1,312,000 = 5^2,624,000 and each hexagon holds 640 = 2^7 × 5 books, the ratio yields 5^2,623,999 / 2^7, which is not an integer. This demonstrates the Library cannot perfectly fill its hexagons — it is either incomplete, contains a specially-configured hexagon, or some hexagons remain partially empty.

### Information content and findability

- Books with an identical first page (3,200 symbols fixed): 25^1,308,800 variations exist
- The probability of randomly finding any specific book is vanishingly small — incomparably more improbable than winning a lottery (1 in 10^8)
- Most books in the Library admit no description shorter than the book itself, making any external catalog useless

### Fundamental theorem

The Library is its own catalogue. No external catalogue can be constructed because any book describing the Library's organization would itself need a location within the Library, creating an infinite regress. All other catalogues are unthinkable.

## Chapter 3 — Real Analysis: The Book of Sand

Bloch explores three formal interpretations of how a Book with infinitely many pages can have definite thickness:

### First interpretation (Zeno's paradox framework)

- If pages decrease in thickness following a geometric sequence (1/2, 1/4, 1/8, ...), their thicknesses sum to exactly one standard page thickness: 1/2 + 1/4 + 1/8 + ... = 1
- The 41st page has thickness (1/2)^40 × (standard page thickness) ≈ 10^-15 meters — thinner than a proton
- Crucially: while individual pages become invisibly thin, almost every page remains technically *finite*, not infinitesimal

### Second interpretation (measure theory)

- Using measure theory, each page can be assigned thickness of measure zero through a construction that covers pages in intervals whose total length is arbitrarily small
- Rigorous result: *the Book of Sand itself has thickness of measure 0* — it would be invisible if viewed from the side and impossible to open
- This resolves the logical paradox by showing zero-thickness and infinite pages are mathematically compatible

### Third interpretation (nonstandard analysis)

- Uses hyperreal numbers and infinitesimals (quantities infinitely close to zero, smaller than any positive real number)
- Each page is assigned an infinitesimal thickness; adding infinitely many infinitesimals produces another infinitesimal
- The Book acquires a precisely calculable nonstandard thickness despite being infinitely thin

### Unifying conclusion

Regardless of interpretation, if pages are infinitely thin, the Book itself must be infinitely thin. Through exponential decay, measure theory, and nonstandard analysis, Bloch establishes that infinite pages and zero (or infinitesimal) thickness are the only self-consistent physical properties for such a book.

## Chapter 4 — Topology and Cosmology: The Universe (Which Others Call the Library)

### Topological models for the Library

Bloch proposes that the Library satisfies Borges' classic dictum — "The Library is a sphere whose exact center is any hexagon and whose circumference is unattainable" — through three-dimensional manifolds: the **3-sphere**, **3-torus**, or **3-Klein bottle**. Each is locally Euclidean, periodic, boundaryless, and limitless.

### Key structural properties

The 3-sphere in 4-dimensional space exhibits: (1) no boundaries or walls; (2) periodicity — any straight line returns to its starting point; (3) center everywhere and nowhere; (4) unattainable circumference; (5) great circles (geodesics) that intersect at exactly two points. The 3-torus achieves the same properties through toroidal topology: it can be realised as geometrically flat while maintaining periodicity and having no inside/outside distinction.

### The 3-Klein bottle model

The Klein bottle is a one-sided surface with no boundary. Embedded in 4-dimensional Euclidean space it has codimension 2 (codimension = dimension of the space minus dimension of the object), meaning it cannot divide space into separate regions — there is no meaningful inside or outside, capturing the Library's non-orientable, unified structure.

### Geometric implications

All three models are limitless and periodic, satisfying both the classic dictum and the librarian's "elegant hope." A Library modeled on the 3-torus or 3-Klein bottle would appear flat and locally ordinary at the scale of a hexagon, while globally exhibiting the topological properties Borges described.

## Chapter 5 — Geometry and Graph Theory: Ambiguity and Access

### Physical dimensions and structure

Bloch derives concrete hexagon dimensions from measurements of actual libraries (the Miguel Cané Municipal Library in Buenos Aires, where Borges worked). Each hexagon's side measures approximately **3 meters**, with 20 bookshelves distributed as 5 long shelves per side on four of the six walls. The hexagons tile each floor as a honeycomb with **no interstices**. The spiral staircase diameter is approximately 1 meter, and the miniature rooms (for sleeping and physical necessities) measure approximately 0.5 m × 0.5 m.

### Connectivity and accessibility

Under Bloch's modified interpretation (one spiral staircase per pair of hexagons), a librarian can reach any adjacent hexagon by traveling through only two additional hexagons and two flights of stairs — one up, one down. The spiral staircase geometry makes each floor's plan identical to every other floor: hexagons above and below any given hexagon are exact clones, making vertical navigation predictable.

### The inaccessibility result

Bloch proves what he calls a conjecture of "extreme disconsolation": for any positive integer n (he illustrates with n up to a trillion), there must exist pairs of abutting hexagons H₁ and H₂ such that a librarian would need to walk through more than n distinct hexagons to travel between them. Floor plans can contain effectively inaccessible regions, making certain adjacent hexagons practically unreachable despite their geometric proximity. The Library's honeycomb topology contains radical disconnection alongside its superficial connectivity.

## Chapter 6 — More Combinatorics: Disorderings into Order

### Orderings of the Library

The Library contains 25^1,312,000 distinct books, and there are **(25^1,312,000)!** different linear orderings of them. Applying Stirling's approximation, the number of digits of this factorial is itself astronomically large — writing the number down would require a multi-volume set of Library-format books.

To accommodate all possible orderings simultaneously, Bloch considers constructing (25^1,312,000)! Library-sized regions, each containing exactly one ordering of the books — (number of distinct books) × (number of distinct orderings) book slots in total.

### The iterative Grand Pattern

The chapter generalizes to a recursive "Grand Pattern": an iterative construction where the Library is tiled by **libits** (contiguous accessible regions), each holding one particular ordering. The next step creates orderings of orderings — ((25^1,312,000)!)! arrangements — continuing ad infinitum through orders of orders of orders.

A critical property emerges: for any chosen libit shape, **there exists exactly one Grand Pattern**. Every finite pattern of books, no matter how dispersed, repeats infinitely throughout the Library.

### Maximum disorder as overarching order

The chapter's central insight: the books of the infinite Library are maximally disordered, yet this ultimate disorder forms a unique overarching Order of all orderings — the Grand Pattern. The Library's chaos is not random but structured: any finite assembly of book orderings appears infinitely many times throughout Euclidean 3-space, echoing the story's closing line that the Library is "unlimited and periodic."

## Chapter 7 — A Homomorphism: Structure into Meaning

Chapter 7 establishes a formal homomorphic mapping between the Library's structure and a Turing machine, demonstrating computational equivalence. The librarian's constrained movement through hexagonal rooms (forward/retrograde only) maps to tape-head motion; each room's finite symbol alphabet maps to tape symbols; the librarian's internal states map to machine states; and the librarian's actions (erase/write, move, change state, halt) correspond to Turing operations.

This homomorphism reveals the Library-plus-librarian as a universally computable system — its underlying structure is Turing-equivalent. The mathematical implication is that the Library and librarian together constitute an unimaginable program whose output transcends interpretation by any observer within the system itself, establishing a formal parallel between the Library's infinite yet deterministic structure and the boundaries of computational logic.

## Chapter 8 — Critical Points

### Traversability

Bloch presents a hexagon-visiting algorithm establishing that any hexagon is at a finite distance from any origin point, so a traveler with unbounded time could eventually visit every hexagon. Despite the Library's unimaginable extent, it is completely traversable in principle.

### Probability of finding *Ficciones*

The chapter's central computation concerns locating Borges' own *Ficciones* as a printed book within the Library:

- Story length: approximately 18,000 orthographic symbols (25-symbol alphabet)
- Book capacity: 1,312,000 slots, giving 1,294,001 possible starting positions for the text
- Distinct books containing the story: 1,294,001 × 25^1,294,000
- **Probability of a randomly selected book containing it: roughly 1 in 10^25,157** — equivalent to winning a major lottery thousands of times consecutively

Despite the Library containing every possible book — including vast numbers of copies of *Ficciones*, and multivolume sets detailing every day of any inhabitant's life — the probability of finding any specific one is vanishingly small. This is the paradox the chapter makes precise: universal comprehensiveness combined with absolute practical inaccessibility.

## Chapter 9 — Openings

The closing chapter situates the Library's mathematics in its historical antecedents rather than deriving new properties. Via Bertrand Russell's rendering of Eddington's "infinite monkeys" thought experiment and the earlier universal-library tradition, Bloch discusses the precursor calculation of a library of **26^700,000 possible books** (books of 700,000 letters from a 26-letter alphabet), with the probability of two randomly selected books being identical equal to (1/26)^700,000.

The same permutation-and-combination principles Robert Burton toyed with (e.g. 8! = 40,320 orderings of eight words) scale to these astronomical dimensions. Bloch documents Borges' engagement with Russell, Cantor's transfinite numbers, and Poincaré, showing that Borges understood the "rudiments of combinatory analysis" well enough to conceive a universe where combinatorial explosion creates an effectively infinite — but ultimately finite and closed — system of all possible books.
