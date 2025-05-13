"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { productSchema, ProductFormValues } from "@/lib/validations/product";
import Image from "next/image";
import "./scrollable-form.css";

// Common size options for MongolZ products moved outside component
const sizeOptions = [
  { id: "XS", label: "XS" },
  { id: "S", label: "S" },
  { id: "M", label: "M" },
  { id: "L", label: "L" },
  { id: "XL", label: "XL" },
  { id: "2XL", label: "2XL" },
  { id: "3XL", label: "3XL" },
  { id: "4XL", label: "4XL" },
  { id: "5XL", label: "5XL" },
  { id: "2XS", label: "2XS" },
  { id: "3XS", label: "3XS" },
  { id: "4XS", label: "4XS" },
  { id: "5XS", label: "5XS" },
];

interface ProductFormProps {
  initialData?: ProductFormValues;
  onSubmitSuccess?: () => void;
}

export function ProductForm({
  initialData,
  onSubmitSuccess,
}: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    isScrolledTop: false,
    isScrolledBottom: true,
  });

  // Handle scroll events to update shadow indicators
  const handleScroll = () => {
    if (formContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        formContainerRef.current;
      const isScrolledToTop = scrollTop > 20;
      const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 20;

      setScrollState({
        isScrolledTop: isScrolledToTop,
        isScrolledBottom: isScrolledToBottom,
      });
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const formContainer = formContainerRef.current;
    if (formContainer) {
      formContainer.addEventListener("scroll", handleScroll);
      // Initialize scroll state
      handleScroll();
    }

    return () => {
      if (formContainer) {
        formContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // Generate ID once for new products
  const generatedId = React.useMemo(() => {
    if (!isEditing) {
      return uuidv4().substring(0, 8);
    }
    return "";
  }, [isEditing]);
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      id: generatedId,
      title: "",
      description: "",
      price: 0,
      price_on_sale: null,
      image: "",
      sizes: [],
      category: "jersey",
      inStock: true,
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      const url = isEditing ? `/api/products/${data.id}` : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      toast.success(isEditing ? "Product updated!" : "Product created!");

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add state for image preview
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null
  );

  // Watch image field for changes but don't cause excessive re-renders
  const imageValue = form.watch("image");

  // Update image preview when image URL changes
  useEffect(() => {
    // Only update if value has changed to prevent unnecessary renders
    const handleImageChange = () => {
      try {
        if (imageValue && imageValue.trim() !== "") {
          setImagePreview(imageValue);
        } else {
          setImagePreview(null);
        }
      } catch (error) {
        console.error("Error updating image preview:", error);
        setImagePreview(null);
      }
    };

    handleImageChange();
  }, [imageValue]);
  return (
    <div
      ref={formContainerRef}
      className={`scrollable-form-container ${
        scrollState.isScrolledTop ? "scrolled-top" : ""
      } ${scrollState.isScrolledBottom ? "scrolled-bottom" : ""}`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Product ID
                    {!isEditing && (
                      <span className="ml-1 text-sm text-gray-500">
                        (auto-generated)
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter product ID"
                      {...field}
                      disabled={isEditing} // Cannot edit ID if editing existing product
                      value={field.value || generatedId}
                    />
                  </FormControl>
                  <FormDescription>
                    A unique identifier for the product
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    {...field}
                    className="min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (₮)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Enter price"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_on_sale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sale Price (₮) (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Enter sale price"
                      value={field.value === null ? "" : field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : Number(e.target.value)
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter image URL" {...field} />
                </FormControl>
                <FormDescription>URL of the product image</FormDescription>
                <FormMessage />
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm mb-1">Preview:</p>
                    <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Product preview"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          // Hide the broken image icon
                          e.currentTarget.style.display = "none";
                          setImagePreview(null);
                          toast.error("Invalid image URL");
                        }}
                      />
                    </div>
                  </div>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormDescription>
                  Category for the product (e.g. jersey, accessory)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>
              Sizes <span className="text-red-500">*</span>
            </FormLabel>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 mt-2 gap-2">
              {sizeOptions.map((option) => (
                <FormField
                  key={option.id}
                  control={form.control}
                  name="sizes"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={option.id}
                        className="flex flex-row items-center space-x-2 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            id={`size-${option.id}`}
                            checked={field.value?.includes(option.id)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || [];
                              if (checked) {
                                field.onChange([...currentValues, option.id]);
                              } else {
                                field.onChange(
                                  currentValues.filter(
                                    (value) => value !== option.id
                                  )
                                );
                              }
                            }}
                            aria-label={`Size ${option.label}`}
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor={`size-${option.id}`}
                          className="font-normal cursor-pointer"
                        >
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </div>

          <FormField
            control={form.control}
            name="inStock"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>In Stock</FormLabel>
                  <FormDescription>
                    Is this product currently available for purchase?
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Product"
                : "Add Product"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Scroll to top button */}
      {scrollState.isScrolledTop && (
        <button
          type="button"
          className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all z-20"
          onClick={() =>
            formContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
          }
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>
      )}
    </div>
  );
}
