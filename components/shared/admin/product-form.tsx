'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useTransition } from 'react';
import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import { insertProductSchema, updateProductSchema } from '@/lib/validators';
import { productDefaultValues } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { UploadButton } from '@/lib/uploadthing';

type ProductFormProps = {
  type: 'Create' | 'Update';
  product?: any;
  productId?: string;
};

const ProductForm = ({ type, product, productId }: ProductFormProps) => {
  const { toast } = useToast();
  const router = useRouter();
  
  const schema = type === 'Create' ? insertProductSchema : updateProductSchema;
  const defaultValues = product
    ? {
        ...product,
        price: product.price?.toString() || '0',
        stock: product.stock || 0,
        images: product.images || [],
        banner: product.banner || null,
      }
    : productDefaultValues;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: type === 'Update' && productId 
      ? { ...defaultValues, id: productId } as z.infer<typeof schema>
      : defaultValues,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof schema>) => {
    startTransition(async () => {
      const result = type === 'Create' 
        ? await createProduct(values as any)
        : await updateProduct(values as any);
        
      if (result.success) {
        toast.success(result.message);
        router.push('/admin/products');
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="product-slug" {...field} />
              </FormControl>
              <FormDescription>
                URL-friendly version of the name (e.g., product-name)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Brand" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Product description"
                  className="min-h-[120px]"
                  {...field}
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
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Format to 2 decimal places
                      if (value) {
                        const num = parseFloat(value);
                        if (!isNaN(num)) {
                          field.onChange(num.toFixed(2));
                        } else {
                          field.onChange(value);
                        }
                      } else {
                        field.onChange('0.00');
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Images</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      const urls = res.map((file) => file.url);
                      field.onChange([...field.value, ...urls]);
                    }}
                    onUploadError={(error) => {
                      toast.error(`Upload failed: ${error.message}`);
                    }}
                  />
                  {field.value && field.value.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {field.value.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1"
                            onClick={() => {
                              const newImages = field.value.filter(
                                (_, i) => i !== index
                              );
                              field.onChange(newImages);
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Upload at least one image for the product
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="banner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner Image (Optional)</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      field.onChange(res[0]?.url || null);
                    }}
                    onUploadError={(error) => {
                      toast.error(`Upload failed: ${error.message}`);
                    }}
                  />
                  {field.value && (
                    <div className="relative">
                      <img
                        src={field.value}
                        alt="Banner"
                        className="w-full h-48 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => field.onChange(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Featured Product</FormLabel>
                <FormDescription>
                  Show this product on the homepage
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Processing...' : `${type} Product`}
        </Button>
      </form>
    </Form>
  );
};

export default ProductForm;

