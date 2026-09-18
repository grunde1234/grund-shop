import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import {
  getAllProducts,
  getAllCategories,
} from "@/lib/actions/product.actions";
import { cn } from "@/lib/utils";
import Link from "next/link";

const prices = [
  { name: "$1 to $50", value: "1-50" },
  { name: "$51 to $200", value: "51-200" },
  { name: "$201 to $1000", value: "201-1000" },
];

const ratings = [4, 3, 2, 1];

const sortOrders = [
  { name: "Newest Arrivals", value: "newest" },
  { name: "Low to High", value: "lowest" },
  { name: "High to Low", value: "highest" },
  { name: "Customer Review", value: "rating" },
];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
  }>;
}) {
  const { q = "all", category = "all", price = "all", rating = "all" } = await props.searchParams;

  const isQuerySet = q !== "all" && q !== "" && q.trim() !== "";
  const isCategorySet = category !== "all" && category !== "" && category.trim() !== "";
  const isPriceSet = price !== "all" && price !== "" && price.trim() !== "";
  const isRatingSet = rating !== "all" && rating !== "" && rating.trim() !== "";

  if(isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return{
      title: `Search - ${isQuerySet ? `Query: ${q}` : ""}${isCategorySet ? ` Category: ${category}` : ""}${isPriceSet ? ` Price: ${price}` : ""}${isRatingSet ? ` Rating: ${rating}` : ""}`,
    }
  }
  else {
     return {
    title: "Search",
  };
  }
}
const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams;

  /* Construct a filter Url */
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = {
      q,
      category,
      price,
      sort,
      page,
      rating,
    }; //* Exists

    if (c) params.category = c;
    if (s) params.sort = s;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    //* cause it will be passed into the function to run
    return `/search?${new URLSearchParams(params).toString()}`;
  };
  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();

  if (!categories.success) return null;
  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/* FILTERS */}
        {/*  URL :{getFilterUrl({})} */}
        {/* CATEGORY LINKS */}
        <div className="text-xl mb-2 mt-3">Department</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${(category === "all" || category === "") && "font-bold"}`}
                href={getFilterUrl({ c: "all" })}
              >
                Any
              </Link>
            </li>
            {categories.data.map((x) => (
              <li key={x.category}>
                <Link
                  className={`${category === x.category && "font-bold"}`}
                  href={getFilterUrl({ c: x.category })}
                >
                  {x.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* RATINGS LINKS */}
        <div className="text-xl mb-2 mt-8">Customer Ratings</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${rating === "all" && "font-bold"}`}
                href={getFilterUrl({ r: "all" })} //*any link
              >
                Any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  className={`${rating === r.toString() && "font-bold"}`}
                  href={getFilterUrl({ r: r.toString() })}
                >
                  {`${r} stars and up`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* PRICE LINKS */}
        <div className="text-xl mb-2 mt-8">Price</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${price === "all" && "font-bold"}`}
                href={getFilterUrl({ p: "all" })} //*any link
              >
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  className={`${price === p.value && "font-bold"}`}
                  href={getFilterUrl({ p: p.value })}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="space-y-4 md:col-span-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {q !== "all" && q !== "" && "Query: " + q}
            {/* Q as the query parameter */}
            {category !== "all" && category !== "" && " Category: " + category}
            {rating !== "all" &&
              rating !== "" &&
              " Rating: " + rating + " & up"}
            {price !== "all" && price !== "" && " Price: " + price}
            &nbsp;
            {(q !== "all" && q !== "") ||
            (category !== "all" && category !== "") ||
            (rating !== "all" && rating !== "") ||
            (price !== "all" && price !== "") ? (
              <Button
                variant={"link"}
                className="px-4 py-2 text-sm font-semibold"
                asChild
              >
                <Link href="/search">Clear</Link>
              </Button>
            ) : null}
          </div>
          <div>
            {/* SORTING */}
            Sort by{" "}
            {sortOrders.map((order) => (
              <Link
                key={order.value}
                className={`mx-2 ${sort === order.value && "font-bold"}`}
                href={getFilterUrl({ s: order.value })}
              >
                {order.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div>No products found</div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
