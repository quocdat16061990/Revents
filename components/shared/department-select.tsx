"use client"

import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DepartmentSelectProps {
  categories: { category: string }[]
  currentCategory: string
  query: string
  price: string
  rating: string
  sort: string
  page: string
}

export default function DepartmentSelect({
  categories,
  currentCategory,
  query,
  price,
  rating,
  sort,
  page,
}: DepartmentSelectProps) {
  const router = useRouter()

  const getFilterUrl = (c?: string) => {
    const params: Record<string, string> = { q: query, category: currentCategory, price, rating, sort, page }
    if (c) params.category = c
    return `/search?${new URLSearchParams(params).toString()}`
  }

  const handleValueChange = (value: string) => {
    router.push(getFilterUrl(value))
  }

  return (
    <Select
      value={currentCategory === "all" || currentCategory === "" ? "all" : currentCategory}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Department" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Any</SelectItem>
        {categories.map((x) => (
          <SelectItem key={x.category} value={x.category}>
            {x.category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

